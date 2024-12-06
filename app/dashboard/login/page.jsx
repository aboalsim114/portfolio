'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaEnvelope, FaFingerprint, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Format d\'email invalide')
    .required('Veuillez saisir votre email'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Veuillez saisir votre mot de passe'),
  rememberMe: Yup.boolean()
});

const CustomField = ({ field, form: { touched, errors }, icon: Icon, ...props }) => (
  <div className="relative group/input">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/input:text-violet-500 transition-all duration-300">
      <Icon className="transform group-hover/input:scale-110 transition-all duration-300" />
    </div>
    <input
      {...field}
      {...props}
      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 
                text-white text-sm transition-all duration-300
                hover:bg-white/10 hover:border-violet-500/50"
    />
    <AnimatePresence>
      {touched[field.name] && errors[field.name] && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute -bottom-6 left-0 text-xs text-pink-500 flex items-center gap-1"
        >
          <FaKey className="text-pink-500" size={10} />
          {errors[field.name]}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function LoginPage() {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Connexion réussie !', {
        icon: '🔐',
        style: { background: '#1E293B', color: 'white' }
      });
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error('Erreur de connexion', {
        icon: '🚫',
        style: { background: '#1E293B', color: 'white' }
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1224] p-4 relative overflow-hidden">
      {/* Effets de fond améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: 360
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: -360
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/20 to-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative"
      >
        {/* Logo animé */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <div className="relative inline-block group">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl blur-xl opacity-50"
            />
            <div className="relative p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 transform transition-transform duration-300 group-hover:scale-110">
              <FaFingerprint className="text-4xl mx-auto bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent" />
            </div>
          </div>
          <motion.h1 
            className="text-2xl font-bold mt-4 bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0%', '100%'],
              color: ['#8B5CF6', '#EC4899']
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Espace Personnel
          </motion.h1>
          <p className="text-gray-400 text-sm mt-2">Sécurisé et confidentiel</p>
        </motion.div>

        {/* Formulaire avec effets améliorés */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6 relative">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    component={CustomField}
                    icon={FaEnvelope}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Field
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    component={CustomField}
                    icon={FaLock}
                  />
                </motion.div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-400 hover:text-gray-300 transition-colors cursor-pointer group/check">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="mr-2 w-3 h-3 rounded border-gray-400 text-violet-500 
                               focus:ring-violet-500 focus:ring-offset-0 transition-all duration-300
                               group-hover/check:border-violet-500"
                    />
                    <span className="relative group-hover:translate-x-1 transition-transform duration-300">
                      Se souvenir
                    </span>
                  </label>
                  <a href="#" className="text-violet-500 hover:text-violet-400 transition-all duration-300 hover:translate-x-1">
                    Mot de passe oublié ?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden rounded-lg p-[1px] 
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50 
                           focus:ring-offset-2 focus:ring-offset-[#0d1224]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300 group-hover:opacity-90" />
                  <div className="relative bg-[#0d1224] rounded-lg p-3 transition-all duration-300 group-hover:bg-opacity-80">
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      <span className="text-white text-sm font-medium flex items-center justify-center gap-2">
                        <FaFingerprint className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                        Se connecter
                      </span>
                    )}
                  </div>
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </div>
  );
} 