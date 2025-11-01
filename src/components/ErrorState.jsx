import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin: 20px 0;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: #e53e3e;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h3`
  color: #742a2a;
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #742a2a;
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #c53030;
  }
`;

const ErrorState = ({ 
  title = "Erro", 
  message = "Ocorreu um erro inesperado", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      {showRetry && onRetry && (
        <RetryButton onClick={onRetry}>
          Tentar novamente
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorState;