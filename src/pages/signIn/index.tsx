import React , { useCallback, useRef } from 'react';
import { 
  Image, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  Alert} 
  from 'react-native';
import Input from '../../components/Input';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.png';
import * as Yup from 'yup';
import { 
  Container, 
  Title, 
  ForgotPassword, 
  ForgotPasswordText, 
  CreateAccountButton, 
  CreateAccountButtonText } 
  from './style';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/Auth'

interface SignInFormData {
  email: string;
  password: string;
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          password: Yup.string().required('Senha Obrigatoria'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

         await signIn({
          email: data.email,
          password: data.password,
        });

      
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro na autenticação, cheque as credenciais',
        );
      }
    }, []);


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
              <Title>Faça seu login</Title>
            </View>
            
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              name="email" 
              icon="mail" 
              placeholder="E-mail"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
              />

              <Input 
              ref={passwordInputRef}
              name="password" 
              icon="lock" 
              placeholder="Senha" 
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm(); 
                 }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm(); 
                 }}
               >
                 Entrar
                 </Button>
            </Form>
            <ForgotPassword onPress={() => { }}>
              <ForgotPasswordText>Esqueci Minha Senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
        
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name='log-in' size={20} color='#ff9000' />
        <CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn;
