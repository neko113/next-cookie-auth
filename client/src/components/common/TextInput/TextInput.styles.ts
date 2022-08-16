import palette, { NormalColorType } from '@/lib/styles/palette';
import styled from '@emotion/styled';
import { InputVariantType } from './TextInput';

export const Root = styled.div`
  position: relative;
  height: 48px;
  width: 100%;
  margin-top: 1rem;
`;

export const Label = styled.label<{
  color: NormalColorType;
  variant: InputVariantType;
}>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0 0.25rem;
  background-color: #fff;
  color: #80868b;
  font-size: 1rem;
  transition: 0.2s;
`;

export const Input = styled.input<{
  color: NormalColorType;
  variant: InputVariantType;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  border: 2px solid #dadce0;
  border-radius: 1rem;
  outline: none;
  padding: 1rem;
  background: none;
  z-index: 1;
  transition: 0.25s;
  &:focus {
    border: 2px solid ${({ color }) => palette[color]};
    & + ${Label} {
      top: -0.5rem;
      left: 0.8rem;
      color: ${({ color }) => palette[color]};
      font-size: 1rem;
      font-weight: 500;
      z-index: 10;
    }
  }

  &:not(:placeholder-shown):not(:focus) + ${Label} {
    top: -0.5rem;
    left: 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    z-index: 10;
  }
`;
