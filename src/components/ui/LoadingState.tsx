interface LoadingStateProps {
  label?: string
}

export const LoadingState = ({ label = 'Carregando dados...' }: LoadingStateProps) => {
  return <div className="state loading">{label}</div>
}
