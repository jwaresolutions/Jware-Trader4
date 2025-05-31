'use client'

import { Button, Container, Typography, Box } from '@mui/material'
import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material-UI Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          This is a test page to verify Material-UI is working correctly.
        </Typography>
        <Typography variant="body2" paragraph>
          Count: {count}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setCount(count + 1)}
          sx={{ mr: 2 }}
        >
          Increment
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setCount(0)}
        >
          Reset
        </Button>
      </Box>
    </Container>
  )
}