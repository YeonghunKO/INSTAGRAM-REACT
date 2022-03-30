import classNames from 'classnames';
import { Container, Body, Title, Text, Image, Button } from './style/Card';

function Card({ classes, children, ...restProps }) {
  console.log(classes);
  return <Container {...restProps}>{children}</Container>;
}

Card.Body = function CardBody({ classes, children, ...restProps }) {
  return <Body {...restProps}>{children}</Body>;
};

Card.Title = function CardTitle({ classes, children, ...restProps }) {
  return <Title {...restProps}>{children}</Title>;
};

Card.Text = function CardText({ classes, children, ...restProps }) {
  return <Text {...restProps}>{children}</Text>;
};

Card.Image = function CardImage({ src, alt, classes, ...restProps }) {
  return <Image src={src} alt={alt} {...restProps} />;
};

Card.Button = function CardButton({ classes, children, ...restProps }) {
  return <Button {...restProps}>{children}</Button>;
};

export default Card;
