# GraphQL Data Efficiency: Solving Over-Fetching and Under-Fetching

## 1. The Core Problem in REST

In REST APIs, endpoints return fixed data shapes. This causes two main inefficiencies:

### Over-fetching

- **Definition:** Getting more data than you need.
- **Example:** Requesting `/users/1` returns name, email, address, profile picture, preferences, etc., even if only `name` and `email` are needed.

### Under-fetching

- **Definition:** Not getting enough data in a single request, requiring multiple calls.
- **Example:** To display a user’s profile with their latest posts and comments:
  1. `/users/1` → basic info
  2. `/users/1/posts` → posts
  3. `/users/1/comments` → comments

---

## 2. How GraphQL Solves It

GraphQL uses a **single endpoint** where the client specifies exactly what data it needs.

| Problem        | REST Example                                                  | GraphQL Solution                                              |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Over-fetching  | `/users/1` returns **20 fields** but UI only needs 3          | Query only those 3 fields (`name`, `email`, `profilePicture`) |
| Under-fetching | `/users/1` → `/users/1/posts` → `/users/1/comments` (3 calls) | Single query requesting all in one go                         |

**Key advantage:** Clients control the shape and depth of the response.

---

## 3. Measurable Metrics & Example

**Scenario:** Need user’s name and profile picture, their last 3 blog posts (title + publish date), and likes count for each post.

### REST Approach

1. `GET /users/1` → returns \~**2 KB** (full user object)
2. `GET /users/1/posts` → returns \~**10 KB** (all posts)
3. `GET /posts/:id/likes` for each post → 3 calls × **\~500 B** each

**Total:** 5 requests, **\~13 KB** transferred.

### GraphQL Approach

```graphql
query {
  user(id: 1) {
    name
    profilePicture
    posts(limit: 3) {
      title
      publishedAt
      likesCount
    }
  }
}
```

- **Single request**
- Only required fields returned → **\~2.5 KB** transferred

**Data Efficiency Gain:**

- Requests: **5 → 1** (80% fewer requests)
- Data size: **13 KB → 2.5 KB** (\~80% less data)
- Lower latency: Fewer HTTP round trips

---

## 4. Why This Matters

- **Developers:** Less code to manage multiple API calls.
- **Users:** Faster load times, better experience on slow networks.
- **Servers:** Reduced bandwidth and connection overhead.

---

## 5. Visual Summary

```
REST:
[ /users ] -> [ /users/:id/posts ] -> [ /posts/:id/likes ]
5 requests | ~13 KB

GraphQL:
[ /graphql ]
1 request | ~2.5 KB
```

---

**Conclusion:** GraphQL’s selective querying significantly reduces over-fetching and under-fetching, leading to measurable improvements in data transfer size, number of requests, and overall performance.
