# Frontend Auth Validation Checklist

## Login

- [ ] Open `/login` and authenticate as `admin` / `admin123`
- [ ] Confirm redirect to `/products`
- [ ] Refresh page and verify session remains active

## Authorization

- [ ] Login as `user` / `user123`
- [ ] Confirm redirect to `/production`
- [ ] Confirm sidebar only displays `Produção`
- [ ] Access `/products` manually and verify automatic redirect to `/production`

## Logout and session handling

- [ ] Click `Sair` and confirm redirect to `/login`
- [ ] Confirm no protected route can be opened while logged out
- [ ] Force a `401` response and confirm redirect to `/login`
