<template>
  <NuxtLayout name="default">
    <div class="space-y-8 max-w-3xl mx-auto">
      <!-- Hero card -->
      <div class="card overflow-hidden p-0">
        <div class="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
        <div class="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <img src="/profile.png" alt="Mirza Aditya Deliantama"
            class="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white flex-shrink-0" />
          <!-- Info -->
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900">Mirza Aditya Deliantama</h1>
            <p class="text-blue-600 font-medium mt-1">Software Developer</p>
            <p class="text-gray-500 text-sm mt-3 leading-relaxed">
              Passionate software developer who built this app to simplify Indonesian PPh21 tax management. Crafted with
              Nuxt 3, PostgreSQL, and a lot of coffee.
            </p>
            <!-- Links -->
            <div class="flex flex-wrap justify-center sm:justify-start gap-3 mt-5">
              <a href="https://mrzdtydlntm.my.id" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portfolio
              </a>
              <a href="https://github.com/mrzdtydlntm" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- App info -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tentang Aplikasi</h2>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          <strong>PPh21 Tax Manager</strong>
          adalah aplikasi manajemen pajak penghasilan PPh21 berbasis web yang dirancang untuk membantu karyawan
          Indonesia memantau, menghitung, dan menganalisis kewajiban pajak penghasilan mereka secara akurat.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-900 text-sm mb-2">Fitur Utama</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Upload slip gaji bulanan</li>
              <li>• Kalkulasi PPh21 progresif 2024</li>
              <li>• Analisis refund / kurang bayar</li>
              <li>• Proyeksi pajak akhir tahun</li>
              <li>• Visualisasi data dengan grafik</li>
            </ul>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <h3 class="font-semibold text-purple-900 text-sm mb-2">Keamanan</h3>
            <ul class="text-sm text-purple-800 space-y-1">
              <li>• Enkripsi AES-256-GCM pada data sensitif</li>
              <li>• Password hashing HMAC-SHA512</li>
              <li>• JWT HS512 via HTTP-only cookie</li>
              <li>• Multi-user dengan isolasi data</li>
              <li>• Reset password via email</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tech stack -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div v-for="tech in techStack" :key="tech.name"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span class="text-2xl">{{ tech.icon }}</span>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ tech.name }}</p>
              <p class="text-xs text-gray-500">{{ tech.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const techStack = [
  { icon: '💚', name: 'Nuxt 3', role: 'Fullstack Framework' },
  { icon: '🐘', name: 'PostgreSQL', role: 'Database' },
  { icon: '🔷', name: 'Prisma ORM', role: 'Database ORM' },
  { icon: '🎨', name: 'TailwindCSS', role: 'Styling' },
  { icon: '📊', name: 'Chart.js', role: 'Data Visualization' },
  { icon: '🔐', name: 'AES-256-GCM', role: 'Field Encryption' }
]

useHead({ title: 'About - PPh21 Tax Manager' })
</script>
