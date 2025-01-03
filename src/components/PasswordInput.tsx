'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Input } from 'antd';
import React from 'react'

const PasswordInput = () => {
  return (
    <Input.Password
    id="password"
    name="password"
    placeholder="Passwort"
    iconRender={(visible) => {
      return visible ? (
        <span className="h-4 w-4">
          <EyeIcon className="h-4 w-4" />
        </span>
      ) : (
        <span className="h-4 w-4">
          <EyeSlashIcon className="h-4 w-4" />
        </span>
      );
    }}
  /> 
  )
}

export default PasswordInput