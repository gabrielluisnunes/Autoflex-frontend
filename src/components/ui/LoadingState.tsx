interface LoadingStateProps {
  label?: string
}

export const LoadingState = ({ label = 'Loading data...' }: LoadingStateProps) => {
  return <div className="state loading">{label}</div>
}
