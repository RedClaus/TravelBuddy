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

const ForgotPasswordScreen = ({ navigation }) => {
  const { requestPasswordReset, error, setError } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);

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

  // Handle password reset request
  const handleResetRequest = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate email
    const isEmailValid = validateEmail();
    
    if (!isEmailValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setResetSent(true);
      } else {
        Alert.alert('Error', result.error || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      console.error('Password reset error:', err);
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            style={styles.logoContainer}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {resetSent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'}
            </Text>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUpBig" 
            duration={1000} 
            style={styles.formContainer}
          >
            {!resetSent ? (
              <>
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

                <Button
                  mode="contained"
                  onPress={handleResetRequest}
                  style={styles.button}
                  loading={loading}
                  disabled={loading}
                >
                  Send Reset Instructions
                </Button>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  If an account exists with the email {email}, you will receive password reset instructions.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.button}
                >
                  Return to Login
                </Button>
              </View>
            )}

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
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

export default ForgotPasswordScreen;
