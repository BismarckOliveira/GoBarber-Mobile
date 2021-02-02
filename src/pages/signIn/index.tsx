import React from 'react';
import { Image} from  'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import { Container , Title } from './style';


const SignIn: React.FC = () => {
  return (
  <Container>
      <Image source={logoImg}/>
      <Title>Faça seu login</Title>

      <Input />
      <Input />
      <Button>ola</Button>
  </Container>
  ) 
}

export default SignIn;
