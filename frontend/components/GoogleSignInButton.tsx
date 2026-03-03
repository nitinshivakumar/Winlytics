"use client";

import { GoogleLogin } from "@react-oauth/google";

type Props = {
  onSuccess: (token: string) => void;
  onError: () => void;
  disabled?: boolean;
};

export function GoogleSignInButton({ onSuccess, onError, disabled }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(res) => {
          if (res.credential) onSuccess(res.credential);
          else onError();
        }}
        onError={onError}
        useOneTap={false}
      />
    </div>
  );
}
