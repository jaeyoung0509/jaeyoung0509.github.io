import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { errorMessage } from "../errors.ts";

const executeFile = promisify(execFile);
export type GitRunner = (args: string[]) => Promise<string>;
export function gitRunner(directory: string): GitRunner {
  return async args => (await executeFile("git", args, { cwd: directory, maxBuffer: 1024 * 1024 })).stdout.trim();
}

export async function readGitStatus(run: GitRunner) {
  try {
    const [branch, status] = await Promise.all([run(["branch", "--show-current"]), run(["status", "--porcelain"])]);
    const changes = status.split("\n").filter(Boolean);
    return { branch, isClean: changes.length === 0, changes };
  } catch (error) {
    return { branch: "unknown", isClean: false, changes: [errorMessage(error, "Git 상태 확인에 실패했습니다.")] };
  }
}

export async function pushContent(message: string, run: GitRunner) {
  try {
    const branch = await run(["branch", "--show-current"]);
    if (!branch) throw new Error("브랜치를 선택한 뒤 다시 시도해주세요.");
    const staged = await run(["diff", "--cached", "--name-only", "-z"]);
    if (staged.split("\0").some(file => file && !/^(content\/posts\/|static\/images\/)/.test(file))) {
      throw new Error("글과 이미지 외의 파일이 스테이징되어 있습니다. 먼저 별도로 처리해주세요.");
    }
    await run(["add", "--", "content/posts", "static/images"]);
    const changes = await run(["diff", "--cached", "--name-only", "-z"]);
    const output: string[] = [];
    if (changes) output.push(await run(["commit", "-m", message.trim() || "content: update blog posts"]));
    output.push(await run(["push", "origin", branch]));
    return { success: true, output: output.filter(Boolean).join("\n") };
  } catch (error) {
    return { success: false, output: errorMessage(error, "Git 푸시에 실패했습니다.") };
  }
}
