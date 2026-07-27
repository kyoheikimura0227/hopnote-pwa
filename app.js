/* PWAインタラクション ＆ Service Worker 登録 (app.js) */

// 1. Service Workerの登録処理
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker 登録成功。スコープ: ', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker 登録失敗: ', err);
      });
  });
}

// 2. 起動スプラッシュのフェードアウト処理
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  
  // 1.8秒間スプラッシュを表示して、その後フェードアウト
  setTimeout(() => {
    if (splash) {
      splash.classList.add('fade-out');
    }
  }, 1800);
});

// 3. シングルページ画面遷移切り替えロジック
function switchView(viewId) {
  const views = ['view-auth', 'view-register', 'view-home'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === viewId) {
        el.classList.remove('hidden');
        el.classList.add('flex');
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    }
  });
}

// 4. デモログイン処理
function demoLogin(provider) {
  const userNameEl = document.getElementById('user-name');
  if (provider === 'google') {
    userNameEl.innerText = 'Google ゲストユーザー';
  } else {
    userNameEl.innerText = 'メールユーザー';
  }
  switchView('view-home');
}

// 5. 新規登録フォーム送信処理
function handleRegister(event) {
  event.preventDefault();
  const nickname = document.getElementById('reg-nickname').value || 'ゲスト';
  const userNameEl = document.getElementById('user-name');
  userNameEl.innerText = nickname;
  switchView('view-home');
}