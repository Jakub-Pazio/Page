---
title: C Test Runner in Go
date: 2025-02-17T21:23:15+01:00
draft: "false"
---

## AWIP: A C Test Runner Built with Go

The idea for this project came to me when learning about Linux, C, data structures and algorithms. C is a simple language with far fewer features compared to languages like Java, Rust or even Go, so it's no surprise that it doesn't have a standard way to execute tests. This was one big feature I missed from Go, so I decided to make a test runner myself.

Of course, this project is simply *reinventing the wheel* because frameworks like this [already exist](https://github.com/ThrowTheSwitch/Unity) and are much better than mine. But I ~~could not figure out how C build systems work~~ 
wanted to force myself to write some C code and this looked like a cool side project to do.

Influenced by the design of the [Go testing library](https://pkg.go.dev/testing), my plan was to create something similar, but in the end, I ended up with something unusual but at least working.

### 30,000-Foot View of the framework architecture

My initial plan for this project was something like this:
1. For each test unit in C, there will be a "**_test.c**" file with main and some assertions that I want to verify. Those assertions will be part of *some library*.
2. Program written in Go will look recursively starting from the root directory matching all test files and execute them
3. ???
4. Go program will gather data from all tests and present results as HTML file.

The framework consists of two parts:

The first part is an assertions and macro library in C. This part lets me write my tests with close to zero boilerplate, handles saving intermediate results, encoding of test results, and at the end sending results using TCP to Go program.

The second part is a Go binary that plays a key role in the whole testing process. It executes tests using the `exec` package. It waits for all tests to finish, parses results from my binary format and finally creates HTML document using the `html/template` package.

The example C test file needs to just include my testing library and is good to go:

```C
#include "../../CTest/cTest.h"
#include "../sorting.h"

int main() {
  INIT_TEST();
  {
    INIT_BLOCK("bubble_sort_int creates non-descending array");

    int got[] = {4, 2, 3, 1, 5, 0};
    int *gotptr = got;
    int want[] = {0, 1, 2, 3, 4, 5};

    bubble_sort_int(gotptr, 6);

    assert_eq_arr_int(got, want, 6);
    assert_eq_int(1, 1);
    END_BLOCK();
  }
  END_TEST();
```

Each `TEST` may have one or more `BLOCK`s, and for each `BLOCK` there can be zero or more asserts (but then it will for sure pass).

### Sending data to Go application

The biggest missing piece in the initial design was how to transfer data from C to the Go program. First idea that came to my mind was to use [gRPC](https://grpc.io/) or just to send data serialized with [protobuf](https://protobuf.dev/) using TCP. Unluckily they both support Go and C++ but not C 😞. One (and probably most sane) option was to encode and send this data using some text based format. For some reason - heavily influenced my [protohackers](https://protohackers.com/) challenges I was doing, I ended up writing my own binary protocol for test results.

![Protocol format diagram](/protocol_wire_format.png)

After implementing this protocol in both Go and C, I have to say that the coding in the former felt at least an order of magnitude more productive.

It almost feels like creators of Go programming language coded C in UNIX environment for a long time and were able to combine all advantages of those two platforms into very concise but powerful language.

### Results

Even though I did not expect this to be a successful project, after hacking it in 2/3 days I'm very happy with the results.

Yes, design of my assertion library is highly coupled with the part that is exporting data to Go application. Yes, assertion messages are vague and lack some crucial information (it is nearly impossible to create **generic assertions** in C due to ... well lack of generics, runtime type introspection is impossible - I think - in C, and I'm not sure if you can solve those issues with macros). But it is useful for me, I have some structured way that I can test my code.

In the end, what I can say is that I had fun writing project, especially the Go part

![part of file with tests statistics](/test_screen.png) 
*part of report with assertion statistics*

### Name of the project

There are only 3 hard things in computer science:

- cache invalidation
- naming things
- off-by-1-errors
- project estimations

And I didn't know how to choose one for my own project. Until I came up with a clever trick:

```bash
echo "I have no idea for name of this program but it runs C tests and gathers results using Go application then displays it as a html page so you can see what went wrong and at which place Maybe I will add benchmarks and some plots" | firstToCapital | fold -w 1 | sort | uniq -c | sort -rn | head -n 4 | awk '{printf "%s", $2}' && echo 
// AWIP
```

So the name of this project is officially [AWIP](https://github.com/Jakub-Pazio/AWIP). 
