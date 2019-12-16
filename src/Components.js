import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
`;
export const ReaderContainer = styled.div`
  font-size: 16px;
  position: absolute;
  top: ${props => (props.fullscreen ? 0 : 135)}px;
  left: ${props => (props.fullscreen ? 0 : 1)}rem;
  right: ${props => (props.fullscreen ? 0 : 1)}rem;
  bottom: ${props => (props.fullscreen ? 0 : 1)}rem;
  transition: all 0.6s ease;
  ${props => !props.fullscreen && "0 0 5px rgba(0,0,0,.3);"};
`;
export const Bar = styled.header`
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;

  ${breakpoint("tablet")`
    display: flex;
    align-items: flex-end;
  `};
`;
export const ButtonWrapper = styled.div`
  ${breakpoint("mobile")`
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding-top: 0.5rem;
  `};
`;
export const LogoWrapper = styled.a`
  ${breakpoint("tablet")`
    margin-right: auto;
  `};
`;
export const Logo = styled.img`
  width: 250px;
  height: auto;
  display: block;
  margin: 0 auto 0px;
  ${breakpoint("tablet")`
    width: 330px;
    height: 104px;
    display: inline-block;
    margin-left: 2px;
  `};
`;
const Button = styled.button`
  font-family: inherit;
  font-size: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  appearance: none;
  background: none;
`;
export const GenericButton = styled(Button)`
  color: #808080;
  font-size: 12px;
  display: inline-block;
  margin-left: 1rem;
  ${breakpoint("tablet")`
    font-size: 16px;
    
  `};
`;
export const CloseIcon = styled.i`
  vertical-align: middle;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: #666;
  margin-left: 5px;
  border-radius: 50%;
  position: relative;
  transform: rotate(45deg);
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 2px;
    background: #fff;
    margin-left: -30%;
    margin-top: -1px;
    border-radius: 1px;
  }
  &:after {
    transform: rotate(-90deg);
  }
`;
export const FontSizeButton = styled(Button)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: #eee;
  border-radius: 2px;
  padding: 0.5rem;
`;
