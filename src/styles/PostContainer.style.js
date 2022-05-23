import styled from '@emotion/styled';

export const PostContainer = styled.section`
  display: flex;
  height: 100%;
  width: ${({ width }) => `${width}00%`};
  transform: ${({ postWidth, currentPostIndex }) =>
    `translate3d(-${postWidth * currentPostIndex}px,0,0)`};
  transition: transform 0.5s ease-in-out;
`;
