package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val RetroColorScheme = darkColorScheme(
  primary = RetroGreen,
  onPrimary = RetroDarkGreen,
  primaryContainer = RetroPhoneBody,
  onPrimaryContainer = RetroGreen,
  secondary = RetroAmber,
  onSecondary = Color.Black,
  background = RetroDarkBg,
  onBackground = RetroOnSurface,
  surface = RetroSurface,
  onSurface = RetroOnSurface,
  surfaceVariant = RetroNavy,
  onSurfaceVariant = Color(0xFFB0BEC5)
)

@Composable
fun MyApplicationTheme(
  content: @Composable () -> Unit
) {
  MaterialTheme(
    colorScheme = RetroColorScheme,
    typography = Typography,
    content = content
  )
}
