/**
 * Example: Gradient Button Components
 * 
 * This example shows how to create beautiful gradient buttons using the design system.
 */

import { useGradient, useButtonStyles, useContextColors } from '../lib/hooks'
import { ContextName } from '../lib/hooks'

// Reusable Gradient Button Component
interface GradientButtonProps {
  context: ContextName
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function GradientButton({
  context,
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false
}: GradientButtonProps) {
  const gradient = useGradient(context, 'primary')
  const colors = useContextColors(context)
  
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  }
  
  const variantStyles = {
    primary: {
      ...gradient.style,
      color: 'white',
      border: 'none',
      boxShadow: `0 4px 15px ${colors.primary[500]}40`
    },
    secondary: {
      backgroundColor: colors.light,
      color: colors.dark,
      border: `1px solid ${colors.primary[200]}`,
      boxShadow: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.main,
      border: `2px solid ${colors.main}`,
      boxShadow: 'none'
    }
  }
  
  return (
    <button
      onClick={onClick}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'primary' ? `0 8px 25px ${colors.primary[500]}60` : undefined
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary[500]}60`
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = `0 4px 15px ${colors.primary[500]}40`
        }
      }}
    >
      {children}
    </button>
  )
}

// Example: Button Showcase
export function ButtonShowcase() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>Gradient Button Showcase</h2>
      
      {/* Primary Buttons */}
      <section style={{ marginTop: '30px' }}>
        <h3>Primary Buttons</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
          <GradientButton context="admin" onClick={() => alert('Admin clicked!')}>
            Admin Action
          </GradientButton>
          <GradientButton context="learning" onClick={() => alert('Learning clicked!')}>
            Start Learning
          </GradientButton>
          <GradientButton context="course" onClick={() => alert('Course clicked!')}>
            View Course
          </GradientButton>
          <GradientButton context="success" onClick={() => alert('Success clicked!')}>
            Complete
          </GradientButton>
          <GradientButton context="brand" onClick={() => alert('Brand clicked!')}>
            Get Started
          </GradientButton>
        </div>
      </section>
      
      {/* Button Sizes */}
      <section style={{ marginTop: '40px' }}>
        <h3>Button Sizes</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
          <GradientButton context="learning" size="sm">
            Small
          </GradientButton>
          <GradientButton context="learning" size="md">
            Medium
          </GradientButton>
          <GradientButton context="learning" size="lg">
            Large
          </GradientButton>
        </div>
      </section>
      
      {/* Button Variants */}
      <section style={{ marginTop: '40px' }}>
        <h3>Button Variants</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <GradientButton context="course" variant="primary">
            Primary
          </GradientButton>
          <GradientButton context="course" variant="secondary">
            Secondary
          </GradientButton>
          <GradientButton context="course" variant="outline">
            Outline
          </GradientButton>
        </div>
      </section>
      
      {/* Full Width Button */}
      <section style={{ marginTop: '40px' }}>
        <h3>Full Width Button</h3>
        <div style={{ marginTop: '15px', maxWidth: '400px' }}>
          <GradientButton context="success" fullWidth>
            Submit Form
          </GradientButton>
        </div>
      </section>
    </div>
  )
}

// Example: Icon Buttons
export function IconButton({
  context,
  icon,
  children,
  onClick
}: {
  context: ContextName
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}) {
  const gradient = useGradient(context, 'primary')
  
  return (
    <button
      onClick={onClick}
      style={{
        ...gradient.style,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease'
      }}
    >
      {icon}
      {children}
    </button>
  )
}

// Example: Button Group
export function ButtonGroup() {
  const contexts: ContextName[] = ['admin', 'learning', 'course']
  
  return (
    <div style={{ padding: '40px' }}>
      <h2>Button Groups</h2>
      
      <div style={{ display: 'flex', gap: '0', marginTop: '20px' }}>
        {contexts.map((context, index) => {
          const gradient = useGradient(context, 'primary')
          const isFirst = index === 0
          const isLast = index === contexts.length - 1
          
          return (
            <button
              key={context}
              style={{
                ...gradient.style,
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0',
                textTransform: 'capitalize'
              }}
            >
              {context}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Example: Loading Button
export function LoadingButton({
  context,
  children,
  loading = false,
  onClick
}: {
  context: ContextName
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
}) {
  const gradient = useGradient(context, 'primary')
  
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        ...gradient.style,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        opacity: loading ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease'
      }}
    >
      {loading && (
        <span style={{
          width: '16px',
          height: '16px',
          border: '2px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  )
}

// Example: Animated Button
export function AnimatedButton({
  context,
  children,
  onClick
}: {
  context: ContextName
  children: React.ReactNode
  onClick?: () => void
}) {
  const gradient = useGradient(context, 'primary')
  
  return (
    <button
      onClick={onClick}
      style={{
        ...gradient.style,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </button>
  )
}

// Main Demo
export default function GradientButtonsDemo() {
  return (
    <div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <ButtonShowcase />
      <ButtonGroup />
      
      <div style={{ padding: '40px' }}>
        <h2>Special Buttons</h2>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
          <LoadingButton context="learning" loading={true}>
            Loading...
          </LoadingButton>
          
          <LoadingButton context="success" loading={false}>
            Submit
          </LoadingButton>
          
          <AnimatedButton context="brand">
            Hover Me!
          </AnimatedButton>
        </div>
      </div>
    </div>
  )
}

