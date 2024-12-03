"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function LoginAlert({ attempts }) {
  useEffect(() => {
    if (attempts > 2) {
      toast.warning(`Attention: ${attempts} tentatives de connexion échouées. Compte temporairement bloqué après 5 tentatives.`);
    }
  }, [attempts]);

  return null;
} 