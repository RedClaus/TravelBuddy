
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

// Import context
import AuthContext from '../../context/AuthContext';

// Import theme
import theme from '../../theme/theme';

const RegisterScreen = ({ navigation }) => {
  const { register, error, setError } = useContext(AuthContext);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validate first name
  const validateFirstName = () => {
    if (!firstName) {
      setFirstNameError('First name is required');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  // Validate last name
  const validateLastName = () => {
    if (!lastName) {
      setLastNameError('Last name is required');
      return false;
    }
    setLastNameError('');
    return true;
  };

  // Validate email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle registration
  const handleRegister = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate inputs
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register({
        firstName,
        lastName,
        email,
        password,
      });
      
      if (!result.success) {
        Alert.alert('Registration Failed', result.error || 'Please try again with different credentials.');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            style={styles.header}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Travel Buddy</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUpBig" 
            duration={1000} 
            style={styles.formContainer}
          >
            <View style={styles.nameRow}>
              <View style={styles.nameInput}>
                <TextInput
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  onBlur={validateFirstName}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="account" />}
                  error={!!firstNameError}
                />
                {firstNameError ? (
                  <HelperText type="error" visible={!!firstNameError}>
                    {firstNameError}
                  </HelperText>
                ) : null}
              </View>

              <View style={styles.nameInput}>
                <TextInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  onBlur={validateLastName}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="account" />}
                  error={!!lastNameError}
                />
                {lastNameError ? (
                  <HelperText type="error" visible={!!lastNameError}>
                    {lastNameError}
                  </HelperText>
                ) : null}
              </View>
            </View>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              error={!!emailError}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              error={!!passwordError}
            />
            {passwordError ? (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            ) : null}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={secureConfirmTextEntry}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                />
              }
              error={!!confirmPasswordError}
            />
            {confirmPasswordError ? (
              <HelperText type="error" visible={!!confirmPasswordError}>
                {confirmPasswordError}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Sign Up
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%',
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: theme.colors.text,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
