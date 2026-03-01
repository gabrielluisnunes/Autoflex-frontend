interface ErrorBannerProps {
  message?: string | null
}

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) {
    return null
  }

  return <div className="state error">{message}</div>
}
