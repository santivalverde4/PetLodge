import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Toast } from '@/src/components/ui/Toast';
import { Input } from '@/src/components/ui/Input';
import { ScreenProps } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/hooks/useToast';
import { getFriendlyErrorMessage } from '@/src/utils/errors';
import { styles } from './LoginScreen.styles';

export const LoginScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const { toast, showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El correo es requerido');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('El correo no es válido');
      isValid = false;
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email, password });
      // Navigation will happen automatically when user is set in context
    } catch (error: any) {
      showToast(getFriendlyErrorMessage(error, 'Error al iniciar sesión'), 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'height' : undefined}
      style={styles.container}
    >
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>🐾</Text>
            <Text style={styles.logo}>PetLodge</Text>
            <Text style={styles.subtitle}>Regresa con nosotros</Text>
          </View>

          <View style={styles.form}>

            <Input
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              error={emailError}
              required
              editable={!isLoading}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
              required
              editable={!isLoading}
            />
          </View>

          <Button
            title={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            onPress={handleLogin}
            fullWidth
            size="lg"
            disabled={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <Text
              style={styles.link}
              onPress={() => !isLoading && navigation.navigate('Register')}
            >
              Registrarse
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
