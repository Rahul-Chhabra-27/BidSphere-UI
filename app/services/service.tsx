const CART_KEY_PREFIX = "cart_user_";

function getCartKey(userId: number) {
  return CART_KEY_PREFIX + String(userId);
}

export function getCart(userId: number) {
  if (!userId) return [];
  const raw = typeof window !== "undefined" ? localStorage.getItem(getCartKey(userId)) : null;
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(userId: number, cart: any[]) {
  if (!userId) return;
  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
}

export function addToCart(userId: number, product: any) {
  const cart = getCart(userId);
  const idx = cart.findIndex((item: any) => item.id === product.id);
  if (idx > -1) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(userId, cart);
}

export function removeFromCart(userId: number, productId: number) {
  let cart = getCart(userId);
  cart = cart.filter((item: any) => item.id !== productId);
  saveCart(userId, cart);
}

export function clearCart(userId: number) {
  if (!userId) return;
  localStorage.removeItem(getCartKey(userId));
}
