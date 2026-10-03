package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.RetroDarkBg
import com.example.ui.theme.RetroGreen
import com.example.ui.theme.RetroNavy
import com.example.ui.theme.RetroPhoneBody

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        SnakeGameScreen()
      }
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SnakeGameScreen() {
  val context = LocalContext.current
  var webViewRef by remember { mutableStateOf<WebView?>(null) }
  var isSoundMuted by remember { mutableStateOf(false) }
  var showInfoDialog by remember { mutableStateOf(false) }
  var showExitConfirmDialog by remember { mutableStateOf(false) }

  // Handle back button to pause game or confirm before exit
  BackHandler {
    webViewRef?.evaluateJavascript(
      "if (window.NokiaSnakeGame && window.gameInstance) { window.gameInstance.togglePause(); } else { document.getElementById('key-5')?.click(); }",
      null
    )
    showExitConfirmDialog = true
  }

  Scaffold(
    contentWindowInsets = WindowInsets.safeDrawing,
    topBar = {
      TopAppBar(
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = RetroNavy,
          titleContentColor = RetroGreen,
          actionIconContentColor = MaterialTheme.colorScheme.onSurface
        ),
        title = {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
              text = "🐍 SNAKE '97",
              fontFamily = FontFamily.Monospace,
              fontWeight = FontWeight.Black,
              fontSize = 17.sp,
              color = RetroGreen
            )
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              color = RetroPhoneBody,
              shape = RoundedCornerShape(4.dp)
            ) {
              Text(
                text = "NOKIA 3310",
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
              )
            }
          }
        },
        actions = {
          IconButton(
            onClick = {
              isSoundMuted = !isSoundMuted
              webViewRef?.evaluateJavascript(
                "document.getElementById('sound-toggle')?.click();",
                null
              )
            },
            modifier = Modifier.testTag("sound_toggle_button")
          ) {
            Icon(
              imageVector = if (isSoundMuted) Icons.Default.VolumeMute else Icons.Default.VolumeUp,
              contentDescription = if (isSoundMuted) "Unmute Sound" else "Mute Sound",
              tint = if (isSoundMuted) MaterialTheme.colorScheme.error else RetroGreen
            )
          }

          IconButton(
            onClick = {
              webViewRef?.reload()
            },
            modifier = Modifier.testTag("reload_button")
          ) {
            Icon(
              imageVector = Icons.Default.Refresh,
              contentDescription = "Restart Game"
            )
          }

          IconButton(
            onClick = {
              shareWebInstructions(context)
            },
            modifier = Modifier.testTag("share_button")
          ) {
            Icon(
              imageVector = Icons.Default.Share,
              contentDescription = "Share Web Link / Details"
            )
          }

          IconButton(
            onClick = {
              showInfoDialog = true
            },
            modifier = Modifier.testTag("help_button")
          ) {
            Icon(
              imageVector = Icons.Default.HelpOutline,
              contentDescription = "Help & Web Guide"
            )
          }
        }
      )
    },
    containerColor = RetroDarkBg
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
        .background(RetroDarkBg)
    ) {
      AndroidView(
        modifier = Modifier
          .fillMaxSize()
          .testTag("nokia_game_webview"),
        factory = { ctx ->
          createConfiguredWebView(ctx).apply {
            webViewRef = this
            loadUrl("file:///android_asset/nokia-snake/index.html")
          }
        },
        update = {
          webViewRef = it
        }
      )
    }
  }

  if (showInfoDialog) {
    RetroInfoDialog(
      onDismiss = { showInfoDialog = false },
      onShare = { shareWebInstructions(context) }
    )
  }

  if (showExitConfirmDialog) {
    AlertDialog(
      onDismissRequest = { showExitConfirmDialog = false },
      containerColor = RetroNavy,
      title = {
        Text(
          text = "Quit Nokia Snake?",
          fontWeight = FontWeight.Bold,
          color = RetroGreen
        )
      },
      text = {
        Text(
          text = "Your high scores are safely preserved in local storage. Would you like to resume playing or exit the app?",
          color = MaterialTheme.colorScheme.onSurface
        )
      },
      confirmButton = {
        Button(
          onClick = { showExitConfirmDialog = false },
          colors = ButtonDefaults.buttonColors(containerColor = RetroGreen, contentColor = RetroNavy),
          modifier = Modifier.testTag("resume_play_button")
        ) {
          Text("Keep Playing", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(
          onClick = {
            showExitConfirmDialog = false
            (context as? ComponentActivity)?.finish()
          },
          modifier = Modifier.testTag("exit_app_button")
        ) {
          Text("Exit", color = MaterialTheme.colorScheme.error)
        }
      }
    )
  }
}

@SuppressLint("SetJavaScriptEnabled")
private fun createConfiguredWebView(context: Context): WebView {
  return WebView(context).apply {
    layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )
    overScrollMode = WebView.OVER_SCROLL_NEVER
    setBackgroundColor(0xFF12161A.toInt())

    settings.apply {
      javaScriptEnabled = true
      domStorageEnabled = true
      databaseEnabled = true
      mediaPlaybackRequiresUserGesture = false
      allowFileAccess = true
      useWideViewPort = true
      loadWithOverviewMode = true
      cacheMode = WebSettings.LOAD_DEFAULT
      displayZoomControls = false
      builtInZoomControls = false
      setSupportZoom(false)
    }

    webViewClient = object : WebViewClient() {}
    webChromeClient = object : WebChromeClient() {}
  }
}

private fun shareWebInstructions(context: Context) {
  val shareText = """
    🐍 Nokia Snake '97 (HTML5 & JavaScript)
    Play the authentic Nokia 3310 Snake game on any mobile browser (iPhone Safari & Android Chrome)!
    
    Features:
    • Classic LCD dot-matrix display & authentic 8-bit Nokia beeps
    • Physical 3310 keypad + responsive touch swipe controls
    • 5 classic mazes & 9 speed levels
    • Works offline on iOS & Android as a PWA!
    
    Code is included in the project under the /web directory ready for GitHub Pages or Netlify.
  """.trimIndent()

  val intent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_SUBJECT, "Nokia Snake '97 - Responsive Web Game")
    putExtra(Intent.EXTRA_TEXT, shareText)
  }
  context.startActivity(Intent.createChooser(intent, "Share Nokia Snake Game"))
}

@Composable
fun RetroInfoDialog(
  onDismiss: () -> Unit,
  onShare: () -> Unit
) {
  AlertDialog(
    onDismissRequest = onDismiss,
    containerColor = RetroNavy,
    title = {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text(
          text = "🐍 NOKIA SNAKE GUIDE",
          fontWeight = FontWeight.Black,
          fontFamily = FontFamily.Monospace,
          fontSize = 17.sp,
          color = RetroGreen
        )
      }
    },
    text = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .verticalScroll(rememberScrollState())
      ) {
        Text(
          text = "🎮 Controls & Play Styles",
          fontWeight = FontWeight.Bold,
          color = RetroGreen,
          fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
          text = "• Nokia Keypad: 2 (Up), 8 (Down), 4 (Left), 6 (Right), 5/NAVI (Pause/Start).\n" +
              "• Touch Screen: Swipe anywhere across the LCD screen in any direction!\n" +
              "• View Modes: Tap the top 'Arcade' / 'Phone' button to toggle between the classic Nokia 3310 phone frame and modern touch D-Pad arcade mode.",
          fontSize = 13.sp,
          lineHeight = 18.sp,
          color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(14.dp))

        Text(
          text = "🌐 Responsive Mobile Web (iPhone & Android)",
          fontWeight = FontWeight.Bold,
          color = RetroGreen,
          fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
          text = "• Built with HTML5, CSS3, and JavaScript.\n" +
              "• On iPhone Safari: Open the web page, tap 'Share' ⎋ -> 'Add to Home Screen' to launch it as a full-screen app with no browser address bar.\n" +
              "• On Android Chrome: Tap menu -> 'Install app' or 'Add to Home Screen'.\n" +
              "• Works 100% offline with synthesized 8-bit Nokia Web Audio.",
          fontSize = 13.sp,
          lineHeight = 18.sp,
          color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(14.dp))

        Text(
          text = "🐛 Mazes, Speeds & Bonus Beetles",
          fontWeight = FontWeight.Bold,
          color = RetroGreen,
          fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
          text = "• 5 Mazes: Wrap-around (No Walls), Border Box, Tunnel, Mill, and Rails.\n" +
              "• 9 Speed Levels: From relaxed retro pace to hyper speed.\n" +
              "• Bonus Beetle: Appears every 5 regular foods. Catch it before its countdown timer expires for huge bonus points!",
          fontSize = 13.sp,
          lineHeight = 18.sp,
          color = MaterialTheme.colorScheme.onSurface
        )
      }
    },
    confirmButton = {
      Button(
        onClick = onDismiss,
        colors = ButtonDefaults.buttonColors(containerColor = RetroGreen, contentColor = RetroNavy),
        modifier = Modifier.testTag("close_info_button")
      ) {
        Text("Got It!", fontWeight = FontWeight.Bold)
      }
    },
    dismissButton = {
      OutlinedButton(
        onClick = onShare,
        modifier = Modifier.testTag("share_info_button")
      ) {
        Icon(
          imageVector = Icons.Default.Share,
          contentDescription = null,
          modifier = Modifier.size(16.dp),
          tint = RetroGreen
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text("Share Web Info", color = RetroGreen)
      }
    }
  )
}
