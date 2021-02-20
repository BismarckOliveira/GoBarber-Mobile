import React, { useRef , useCallback } from 'react';
import { 
  Image, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TextInput, 
  Alert} 
  from 'react-native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.png';
import * as Yup from 'yup';
import { 
  Container, 
  Title, 
  BackToSignIn, 
  BackToSignInText } 
  from './style';
import { useNavigation } from '@react-navigation/native'  
import Icon from 'react-native-vector-icons/Feather';
import getValidationErrors from '../../utils/getValidationErrors' 

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
 const formRef = useRef<FormHandles>(null);
 const navigation = useNavigation();
 
 const emailIpuntRef = useRef<TextInput>(null);
 const passwordIpuntRef = useRef<TextInput>(null);

 const handleSignUp = useCallback(
  async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('E-mail obrigatório'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

     // await api.post('/users', data);

     //history.push('/');
 
    
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro no cadastro, tente novamente'
      );
    }
  },
  [],
);
  return (
    <>
      <KeyboardAvoidingView 
      style={{ flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
      >
        <ScrollView 
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{flex: 1}}
        > 
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua Conta</Title>
            </View>
            
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input 
              autoCapitalize="words"
              name="name" 
              icon="user" 
              placeholder="Nome"
              returnKeyType="next" 
              onSubmitEditing={() => {
                emailIpuntRef.current?.focus();
              }}
              />

              <Input 
              ref={emailIpuntRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email" 
              icon="mail" 
              placeholder="E-mail" 
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordIpuntRef.current?.focus();
              }}
              />

              <Input 
              ref={passwordIpuntRef}
              name="password" 
              icon="lock" 
              placeholder="Senha" 
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => { 
                formRef.current?.submitForm();
              }}/>

              <Button onPress={() => { 
                formRef.current?.submitForm();
              }}>Entrar</Button>
            </Form>
           
          </Container>
        </ScrollView>
        
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => navigation.goBack()  }>
        <Icon name='arrow-left' size={20} color='#fff' />
        <BackToSignInText>Voltar para Logon</BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp;
