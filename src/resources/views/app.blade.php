<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Universal Booking System') }}</title>
    <script>
        (function() {
            try {
                const saved = localStorage.getItem('app_theme_preference');
                const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
            } catch (e) {}
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-[#f8f9fa] text-[#202124] dark:bg-[#202124] dark:text-[#e8eaed] transition-colors duration-200 h-screen w-screen overflow-hidden">
    @inertia
</body>
</html>