import React from "react";

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;
    const message = isDev ? (error.message || "发生未知错误").trim() : "";

    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-600 px-6 py-16 text-white"
        role="alert"
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(255,255,255,0.20),transparent_60%)]" />
        <main className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-semibold tracking-tight">页面暂时不可用</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
              检测到错误，请刷新页面重试。
            </p>

            {isDev && message ? (
              <pre className="mt-6 w-full max-h-40 overflow-auto rounded-2xl border border-white/10 bg-black/25 p-4 text-left text-sm leading-6 text-white/85 shadow-inner">
                <code>{message}</code>
              </pre>
            ) : null}

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:w-auto"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
