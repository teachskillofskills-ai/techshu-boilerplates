/**
 * Example: Basic Design System Usage
 * 
 * This example shows the fundamental ways to use the design system.
 */

import { useTheme, useGradient, useContextColors } from '../lib/hooks'

// Example 1: Using Theme Colors
export function ThemeColorsExample() {
  const theme = useTheme('learning')
  
  return (
    <div>
      <h2>Theme Colors Example</h2>
      
      {/* Using primary colors */}
      <div style={{
        backgroundColor: theme.primary[500],
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '10px'
      }}>
        Primary Color (500)
      </div>
      
      {/* Using lighter shade */}
      <div style={{
        backgroundColor: theme.primary[100],
        color: theme.primary[700],
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '10px'
      }}>
        Light Primary (100)
      </div>
      
      {/* Using darker shade */}
      <div style={{
        backgroundColor: theme.primary[700],
        color: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        Dark Primary (700)
      </div>
    </div>
  )
}

// Example 2: Using Gradients
export function GradientExample() {
  const primaryGradient = useGradient('learning', 'primary')
  const heroGradient = useGradient('brand', 'hero')
  
  return (
    <div>
      <h2>Gradient Examples</h2>
      
      {/* Primary gradient */}
      <div style={{
        ...primaryGradient.style,
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3>Primary Gradient</h3>
        <p>Beautiful gradient for buttons and CTAs</p>
      </div>
      
      {/* Hero gradient */}
      <div style={{
        ...heroGradient.style,
        color: 'white',
        padding: '50px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h1>Hero Gradient</h1>
        <p>Perfect for hero sections and headers</p>
      </div>
    </div>
  )
}

// Example 3: Using Context Colors
export function ContextColorsExample() {
  const adminColors = useContextColors('admin')
  const learningColors = useContextColors('learning')
  const successColors = useContextColors('success')
  
  return (
    <div>
      <h2>Context Colors Example</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Admin context */}
        <div style={{
          backgroundColor: adminColors.main,
          color: adminColors.contrast,
          padding: '20px',
          borderRadius: '8px',
          flex: '1',
          minWidth: '200px'
        }}>
          <h3>Admin</h3>
          <p>Main: {adminColors.main}</p>
        </div>
        
        {/* Learning context */}
        <div style={{
          backgroundColor: learningColors.main,
          color: learningColors.contrast,
          padding: '20px',
          borderRadius: '8px',
          flex: '1',
          minWidth: '200px'
        }}>
          <h3>Learning</h3>
          <p>Main: {learningColors.main}</p>
        </div>
        
        {/* Success context */}
        <div style={{
          backgroundColor: successColors.main,
          color: successColors.contrast,
          padding: '20px',
          borderRadius: '8px',
          flex: '1',
          minWidth: '200px'
        }}>
          <h3>Success</h3>
          <p>Main: {successColors.main}</p>
        </div>
      </div>
    </div>
  )
}

// Example 4: Complete Component
export function CompleteExample() {
  const theme = useTheme('course')
  const gradient = useGradient('course', 'primary')
  const colors = useContextColors('course')
  
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header with gradient */}
      <header style={{
        ...gradient.style,
        color: 'white',
        padding: '40px',
        borderRadius: '12px 12px 0 0',
        textAlign: 'center'
      }}>
        <h1>Course Dashboard</h1>
        <p>Welcome to your learning journey</p>
      </header>
      
      {/* Content area */}
      <div style={{
        backgroundColor: colors.light,
        padding: '30px',
        borderRadius: '0 0 12px 12px'
      }}>
        <h2 style={{ color: colors.dark }}>Your Courses</h2>
        
        {/* Course cards */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: `1px solid ${theme.primary[200]}`
        }}>
          <h3 style={{ color: colors.main }}>Introduction to React</h3>
          <p style={{ color: colors.primary[600] }}>
            Learn the fundamentals of React development
          </p>
          
          <button style={{
            backgroundColor: colors.main,
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            Continue Learning
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${theme.primary[200]}`
        }}>
          <h3 style={{ color: colors.main }}>Advanced TypeScript</h3>
          <p style={{ color: colors.primary[600] }}>
            Master TypeScript for large-scale applications
          </p>
          
          <button style={{
            backgroundColor: 'white',
            color: colors.main,
            padding: '10px 20px',
            borderRadius: '6px',
            border: `2px solid ${colors.main}`,
            cursor: 'pointer',
            marginTop: '10px'
          }}>
            Start Course
          </button>
        </div>
      </div>
    </div>
  )
}

// Example 5: All Contexts Showcase
export function AllContextsShowcase() {
  const contexts: Array<'admin' | 'learning' | 'course' | 'success' | 'brand'> = [
    'admin',
    'learning',
    'course',
    'success',
    'brand'
  ]
  
  return (
    <div>
      <h2>All Contexts Showcase</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {contexts.map(context => {
          const gradient = useGradient(context, 'primary')
          const theme = useTheme(context)
          
          return (
            <div key={context} style={{
              ...gradient.style,
              color: 'white',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ textTransform: 'capitalize', marginBottom: '10px' }}>
                {context}
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                {theme.name} Context
              </p>
              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontSize: '12px'
              }}>
                Primary: {theme.primary[500]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Main demo component
export default function BasicUsageDemo() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Design System - Basic Usage Examples</h1>
      
      <div style={{ marginTop: '40px' }}>
        <ThemeColorsExample />
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <GradientExample />
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <ContextColorsExample />
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <CompleteExample />
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <AllContextsShowcase />
      </div>
    </div>
  )
}

