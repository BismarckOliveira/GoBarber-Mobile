import React from 'react';

import { TextInputProps } from 'react-native'
import Icon from 'react-native-vector-icons/';
import { Container , TextInput} from './styles'

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({ name , icon , ...rest}) => (
 <Container >
  <TextInput 
  keyboardAppearance="dark"
  placeholderTextColor={"#666360"} 
  {...rest}/>
 </Container>

)
export default Input;
