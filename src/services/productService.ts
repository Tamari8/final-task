import axios from 'axios';
import type { Product } from '../types';

const API_BASE_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fallback catalog used only when FakeStoreAPI is unreachable (e.g. offline mode),
 * ensuring the application remains testable in restricted environments.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description:
      'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: 'John Hardy Women Legends Naga Gold & Silver Dragon Station Chain Bracelet',
    price: 695.0,
    description:
      'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean pearl. Wear facing inward to be bestowed with love and abundance.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 5,
    title: 'Solid Gold Petite Micropave Ring',
    price: 168.0,
    description:
      'Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 6,
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    price: 64.0,
    description:
      'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 7,
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    price: 109.0,
    description:
      'Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 8,
    title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin Monitor',
    price: 599.0,
    description:
      '21.5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. Zero-frame design | ultra-thin | 4ms response time | IPS panel.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    rating: { rate: 2.9, count: 250 },
  },
  {
    id: 9,
    title: 'BIYLACLESEN Women 3-in-1 Snowboard Jacket Winter Coats',
    price: 56.99,
    description:
      'Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    rating: { rate: 2.6, count: 235 },
  },
  {
    id: 10,
    title: 'Lock and Love Women Removable Hooded Faux Leather Moto Biker Jacket',
    price: 29.95,
    description:
      '100% POLYURETHANE(shell) 100% POLYESTER(lining) Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket.',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    rating: { rate: 2.9, count: 340 },
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'ყველა კატეგორია',
  "men's clothing": 'მამაკაცის ტანსაცმელი',
  "women's clothing": 'ქალის ტანსაცმელი',
  jewelery: 'სამკაულები',
  electronics: 'ელექტრონიკა',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

/**
 * Fetches all products from FakeStoreAPI via Axios.
 */
export async function fetchAllProducts(simulateError = false): Promise<Product[]> {
  if (simulateError) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    throw new Error('სერვერთან კავშირის შეცდომა (503 Service Unavailable). გთხოვთ სცადოთ ხელახლა.');
  }

  const response = await apiClient.get<Product[]>('/products');
  if (!Array.isArray(response.data)) {
    throw new Error('API-დან მიღებული მონაცემების ფორმატი არასწორია.');
  }
  return response.data;
}

/**
 * Fetches a single product by ID from FakeStoreAPI via Axios.
 */
export async function fetchProductById(id: number): Promise<Product> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('პროდუქტის არასწორი იდენტიფიკატორი.');
  }

  const response = await apiClient.get<Product>(`/products/${id}`);
  if (!response.data || typeof response.data.id !== 'number') {
    throw new Error('პროდუქტი ვერ მოიძებნა.');
  }
  return response.data;
}
