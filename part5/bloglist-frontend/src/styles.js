import styled, { createGlobalStyle } from 'styled-components'
import { NavLink } from 'react-router-dom'

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; background: #f7f9fc; color: #182538; font-family: Arial, sans-serif; line-height: 1.6; }
  button, input { font: inherit; }
  a { color: #1565c0; overflow-wrap: anywhere; }
  h2 { margin: 0 0 24px; font-size: 28px; line-height: 1.25; }
  :focus-visible { outline: 3px solid #ffbf47; outline-offset: 3px; }
`

export const Shell = styled.div`
  max-width: 1040px;
  margin: 24px auto;
  padding: 0 20px;
`

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 18px 24px;
  margin-bottom: 28px;
  background: #1976d2;
  color: white;
  border-radius: 8px;
  box-shadow: 0 3px 8px #18253820;
  @media (max-width: 540px) { padding: 16px; gap: 8px; }
`

export const Brand = styled.span`
  font-size: 24px;
  font-weight: 700;
  margin-right: auto;
  @media (max-width: 540px) { width: 100%; }
`

export const NavigationLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  &:hover, &.active { background: #ffffff26; }
`

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: 1px solid #1976d2;
  border-radius: 5px;
  background: #1976d2;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover { background: #125ba4; }
  &:disabled { opacity: 0.6; cursor: wait; }
`

export const LogoutButton = styled(Button)`
  background: transparent;
  border-color: transparent;
  padding: 8px 12px;
  &:hover { background: #ffffff26; }
`

export const Card = styled.section`
  padding: clamp(20px, 4vw, 36px);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px #1825380d;
`

export const FormCard = styled(Card)`
  max-width: 600px;
`

export const Form = styled.form`
  display: grid;
  gap: 22px;
  & > button { justify-self: start; }
`

export const Field = styled.label`
  display: grid;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #b8c4d3;
  border-radius: 5px;
  color: #182538;
  background: white;
  &:hover { border-color: #1976d2; }
  &:focus { border-color: #1976d2; }
`

export const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-radius: 6px;
  border: 1px solid ${({ $error }) => $error ? '#efb3b3' : '#b9ddc0'};
  background: ${({ $error }) => $error ? '#fff0f0' : '#edf7ed'};
  color: ${({ $error }) => $error ? '#a12626' : '#256332'};
`

export const BlogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li + li { border-top: 1px solid #e2e8f0; }
  a { display: block; padding: 16px 0; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
`

export const BlogCard = styled(Card)`
  h2 { font-size: clamp(26px, 5vw, 36px); overflow-wrap: anywhere; }
  p { margin: 14px 0; }
`

export const Author = styled.p`
  color: #64748b;
  font-size: 18px;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`

export const OutlineButton = styled(Button)`
  color: ${({ $danger }) => $danger ? '#b42318' : '#1565c0'};
  border-color: ${({ $danger }) => $danger ? '#e8aaa5' : '#93bce7'};
  background: white;
  &:hover { background: ${({ $danger }) => $danger ? '#fff0f0' : '#edf5ff'}; }
`
