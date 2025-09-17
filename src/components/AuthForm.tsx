'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm() {
  const supabase = createClient()

  return (
    <div className="w-full">
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#21808D',
                brandAccent: '#1e737f',
                brandButtonText: 'white',
                defaultButtonBackground: '#f9fafb',
                defaultButtonBackgroundHover: '#f3f4f6',
                defaultButtonBorder: '#e5e7eb',
                defaultButtonText: '#374151',
                dividerBackground: '#e5e7eb',
                inputBackground: 'white',
                inputBorder: '#e5e7eb',
                inputBorderHover: '#21808D',
                inputBorderFocus: '#21808D',
                inputText: '#111827',
                inputLabelText: '#374151',
                inputPlaceholder: '#9ca3af',
                messageText: '#374151',
                messageTextDanger: '#dc2626',
                anchorTextColor: '#21808D',
                anchorTextHoverColor: '#1e737f',
              },
              space: {
                spaceSmall: '4px',
                spaceMedium: '8px',
                spaceLarge: '16px',
                labelBottomMargin: '8px',
                anchorBottomMargin: '4px',
                emailInputSpacing: '4px',
                socialAuthSpacing: '4px',
                buttonPadding: '12px 24px',
                inputPadding: '12px 16px',
              },
              fontSizes: {
                baseBodySize: '14px',
                baseInputSize: '14px',
                baseLabelSize: '14px',
                baseButtonSize: '14px',
              },
              fonts: {
                bodyFontFamily: `'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
                buttonFontFamily: `'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
                inputFontFamily: `'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
                labelFontFamily: `'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '12px',
                buttonBorderRadius: '12px',
                inputBorderRadius: '12px',
              },
            },
            dark: {
              colors: {
                brand: '#21808D',
                brandAccent: '#26a0ae',
                brandButtonText: 'white',
                defaultButtonBackground: '#1f2937',
                defaultButtonBackgroundHover: '#374151',
                defaultButtonBorder: '#374151',
                defaultButtonText: '#d1d5db',
                dividerBackground: '#374151',
                inputBackground: '#111827',
                inputBorder: '#374151',
                inputBorderHover: '#21808D',
                inputBorderFocus: '#21808D',
                inputText: '#f9fafb',
                inputLabelText: '#d1d5db',
                inputPlaceholder: '#6b7280',
                messageText: '#d1d5db',
                messageTextDanger: '#ef4444',
                anchorTextColor: '#26a0ae',
                anchorTextHoverColor: '#21808D',
              },
            },
          },
          className: {
            anchor: 'font-medium hover:underline transition-colors duration-200',
            button: 'font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#21808D] focus:outline-none',
            container: 'font-inter',
            divider: 'my-6',
            input: 'transition-all duration-200 focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 focus:outline-none',
            label: 'font-medium text-sm',
            loader: 'border-[#21808D]',
            message: 'text-sm mt-2',
          },
        }}
        theme="default"
        showLinks={false}
        providers={[]}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        localization={{
          variables: {
            magic_link: {
              email_input_label: 'Email address',
              email_input_placeholder: 'Enter your email',
              button_label: 'Send magic link',
              loading_button_label: 'Sending magic link...',
              link_text: 'Send a magic link email',
              confirmation_text: 'Check your email for the magic link',
            },
          },
        }}
      />
    </div>
  )
}
