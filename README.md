# 🛍️ ShopFlow — თანამედროვე E-Commerce ვებ-აპლიკაცია React-ში

**ShopFlow** არის სრულფასოვანი, მრავალგვერდიანი E-Commerce ვებ-აპლიკაცია, შექმნილი **React 19**, **TypeScript**, **React Router v7**, **Tailwind CSS v4** და **Axios**-ის გამოყენებით თანამედროვე ფრონტენდ სტანდარტების დაცვით.

---

## 🚀 პროექტის ლოკალურად გაშვება

1. **დამოკიდებულებების (Dependencies) ინსტალაცია:**
   ```bash
   npm install
   ```

2. **დეველოპმენტ სერვერის გაშვება:**
   ```bash
   npm run dev
   ```
   აპლიკაცია გაიხსნება მისამართზე: `http://localhost:5173`

3. **Production Build-ის შემოწმება:**
   ```bash
   npm run build
   npm run preview
   ```

---

## ✨ შესრულებული ტექნიკური მოთხოვნები და ფუნქციონალი

### 1. კომპონენტური არქიტექტურა და მკაცრი TypeScript
- ყველა კომპონენტის პროპსი, სტეიტი და API-დან მიღებული მონაცემი მკაცრად არის ტიპიზირებული [`src/types/index.ts`](src/types/index.ts)-ში.
- **ლეიაუთი (`MainLayout`):** [`src/layouts/MainLayout.tsx`](src/layouts/MainLayout.tsx) აერთიანებს `Header`-ს, React Router-ის `<Outlet />`-ს, `CartDrawer`-ს, `Notification`-სა და `Footer`-ს.
- **მოდულური კომპონენტები:**
  - [`Header`](src/components/Header.tsx) — ნავიგაცია, პრომო-ბანერი, `ThemeToggle` და კალათის ინდიკატორი ანიმაციით.
  - [`Footer`](src/components/Footer.tsx) — ფუტერი გარანტიების ბლოკით, ბმულებით, საავტორო უფლებებითა და თემის გადამრთველით.
  - [`ThemeToggle`](src/components/ThemeToggle.tsx) — ანიმაციური გადამრთველი ღილაკი Light და Dark რეჟიმებისთვის (`Sun` / `Moon`).
  - [`Breadcrumbs`](src/components/Breadcrumbs.tsx) — პურის ნამცეცები პროდუქტის დეტალურ და შეკვეთის გვერდებზე მარტივი ნავიგაციისთვის.
  - [`ProductList`](src/components/ProductList.tsx) — კატალოგი ძიებით, კატეგორიის ფილტრით, ფასის სლაიდერითა და სორტირებით.
  - [`ProductCard`](src/components/ProductCard.tsx) — პროდუქტის ბარათი (`React.memo`, LCP სურათების ოპტიმიზაციით `fetchPriority="high"` / `loading="lazy"`).
  - [`CartDrawer`](src/components/CartDrawer.tsx) — მოცურავე კალათის პანელი უფასო მიწოდების პროგრეს-ბარით.
  - [`CheckoutForm`](src/components/CheckoutForm.tsx) — შეკვეთის გაფორმების ფორმა ჩაშენებული და Custom ვალიდაციებით.
  - [`Notification`](src/components/Notification.tsx) — Toast შეტყობინებების სისტემა (`aria-live="polite"`).

### 2. სტეიტ მენეჯმენტი და ჰუკები (State Management & Hooks)
- **Global Cart State:** [`CartContext`](src/context/CartContext.tsx) მართავს კალათის მონაცემებს (დამატება, წაშლა, რაოდენობის შეცვლა, ქვეჯამი, ფასდაკლება, მიწოდება, საერთო თანხა).
- **Global Theme State (Light / Dark Mode):** [`ThemeContext`](src/context/ThemeContext.tsx) მართავს აპლიკაციის თემას Context API-ით, სისტემური თემის ამოცნობითა და `localStorage`-ში შენახვით.
- **Custom Hooks:**
  - [`useTheme`](src/hooks/useTheme.ts) — თემის გლობალურ კონტექსტთან წვდომისთვის (`theme`, `toggleTheme`, `setTheme`).
  - [`useCart`](src/hooks/useCart.ts) — გლობალური კალათის კონტექსტთან მკაცრად ტიპიზირებული წვდომისთვის.
  - [`useLocalStorage`](src/hooks/useLocalStorage.ts) — მონაცემების ბრაუზერის `localStorage`-ში უსაფრთხოდ შესანახად.
  - [`useDebounce`](src/hooks/useDebounce.ts) — პროდუქტების ძიების ოპტიმიზაციისთვის.
- **React Hooks:** აქტიურად გამოყენებულია `useState`, `useEffect`, `useMemo` და `useCallback`.

### 3. მონაცემთა მიღება (API / HTTP Calls)
- [`productService.ts`](src/services/productService.ts) იყენებს `axios`-ს **FakeStoreAPI**-დან (`https://fakestoreapi.com/products`) მონაცემების დინამიურად წამოსაღებად.
- ვიზუალურად დამუშავებულია როგორც **Loading** (Skeleton ბარათები), ისე **Error** მდგომარეობა (კატალოგში ასევე ჩაშენებულია `Error ტესტი` ღილაკი შეცდომის ვიზუალური ეკრანის სწრაფი შემოწმებისთვის).

### 4. როუტინგი და ზარმაცი ჩატვირთვა (Routing & Lazy Loading)
- როუტინგი გამოყოფილია ცალკე კომპონენტად: [`src/routes/AppRoutes.tsx`](src/routes/AppRoutes.tsx).
- `/products` — მთავარი კატალოგი ([`ProductsPage`](src/pages/ProductsPage.tsx))
- `/products/:id` — პროდუქტის დეტალური გვერდი ([`ProductDetailPage`](src/pages/ProductDetailPage.tsx))
- `/checkout` და `/cart` — კალათა და შეკვეთის გაფორმების გვერდი ([`CheckoutPage`](src/pages/CheckoutPage.tsx)), რომელიც იტვირთება ზარმაცად **`React.lazy`** და **`Suspense`**-ის გამოყენებით.

### 5. ფორმები და Custom Validation
- სავალდებულო ველების, სრული სახელისა და ელ-ფოსტის ფორმატის ვალიდაცია (`onBlur` ვალიდაცია და `onChange` გასუფთავება).
- **Custom Validation #1 (ტელეფონის ნომერი):** ქართული მობილურის ნომრის ფორმატის კონტროლი (`+995 5XX XX XX XX` ან `5XXXXXXXX`).
- **Custom Validation #2 (პრომო-კოდი):** პრომო-კოდის ფორმატისა და აქტიური კოდების (`SHOPFLOW20` — 20%, `STUDENT15` — 15%, `SALE10` — 10%) შემოწმება რეალური ფასდაკლების დაანგარიშებით.
