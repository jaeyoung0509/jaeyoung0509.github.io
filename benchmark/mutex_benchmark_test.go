package mutexbench

import (
	"runtime"
	"sync"
	"sync/atomic"
	"testing"
)

const cacheLineSize = 64

var benchmarkSink uint64

type compactCounter struct {
	value atomic.Uint64
}

type paddedCounter struct {
	value atomic.Uint64
	_     [cacheLineSize - 8]byte
}

func benchmarkWorkers() int {
	workers := runtime.GOMAXPROCS(0)
	if workers < 2 {
		return 2
	}
	return workers
}

func runWorkers(b *testing.B, workers int, worker func(id, operations int)) {
	b.Helper()

	base := b.N / workers
	remainder := b.N % workers

	var wg sync.WaitGroup
	start := make(chan struct{})
	wg.Add(workers)

	for id := 0; id < workers; id++ {
		operations := base
		if id < remainder {
			operations++
		}

		go func(id, operations int) {
			defer wg.Done()
			<-start
			worker(id, operations)
		}(id, operations)
	}

	b.ResetTimer()
	close(start)
	wg.Wait()
	b.StopTimer()
}

func BenchmarkMutexUncontended(b *testing.B) {
	var mu sync.Mutex
	var counter uint64

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		mu.Lock()
		counter++
		mu.Unlock()
	}
	b.StopTimer()

	benchmarkSink = counter
}

func BenchmarkMutexContended(b *testing.B) {
	var mu sync.Mutex
	var counter uint64
	workers := benchmarkWorkers()

	runWorkers(b, workers, func(_, operations int) {
		for i := 0; i < operations; i++ {
			mu.Lock()
			counter++
			mu.Unlock()
		}
	})

	benchmarkSink = counter
}

func BenchmarkAtomicUncontended(b *testing.B) {
	var counter atomic.Uint64

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		counter.Add(1)
	}
	b.StopTimer()

	benchmarkSink = counter.Load()
}

func BenchmarkAtomicShared(b *testing.B) {
	var counter atomic.Uint64
	workers := benchmarkWorkers()

	runWorkers(b, workers, func(_, operations int) {
		for i := 0; i < operations; i++ {
			counter.Add(1)
		}
	})

	benchmarkSink = counter.Load()
}

func BenchmarkAtomicPerWorkerFalseSharing(b *testing.B) {
	workers := benchmarkWorkers()
	counters := make([]compactCounter, workers)

	runWorkers(b, workers, func(id, operations int) {
		for i := 0; i < operations; i++ {
			counters[id].value.Add(1)
		}
	})

	var total uint64
	for i := range counters {
		total += counters[i].value.Load()
	}
	benchmarkSink = total
}

func BenchmarkAtomicPerWorkerPadded(b *testing.B) {
	workers := benchmarkWorkers()
	counters := make([]paddedCounter, workers)

	runWorkers(b, workers, func(id, operations int) {
		for i := 0; i < operations; i++ {
			counters[id].value.Add(1)
		}
	})

	var total uint64
	for i := range counters {
		total += counters[i].value.Load()
	}
	benchmarkSink = total
}
