# Athanor Project Architecture

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Main landing page (Abyss)
│   ├── globals.css              # Global styles
│   ├── founder/                 # Founder role pages
│   │   ├── page.tsx            # Launchpad (main founder page)
│   │   ├── wallet/
│   │   │   └── page.tsx        # Founder wallet
│   │   ├── referral/
│   │   │   └── page.tsx        # Founder referral program
│   │   └── profile/
│   │       └── page.tsx        # Founder profile
│   ├── investor/                # Investor role pages
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Investor vault/dashboard
│   │   └── profile/
│   │       └── page.tsx        # Investor profile
│   ├── advisor/                 # Advisor role pages
│   │   ├── services/
│   │   │   └── page.tsx        # Advisor services
│   │   └── profile/
│   │       └── page.tsx        # Advisor profile
│   ├── marketplace/             # Marketplace (shared)
│   │   └── page.tsx
│   ├── connect/                 # Role selection (legacy)
│   │   └── page.tsx
│   ├── launchpad/               # Legacy launchpad (redirects to /founder)
│   │   └── page.tsx
│   ├── wallet/                  # Legacy wallet (redirects to /founder/wallet)
│   │   └── page.tsx
│   ├── referral/                # Legacy referral (redirects to /founder/referral)
│   │   └── page.tsx
│   └── profile/                 # Legacy profile (redirects to role-specific)
│       └── page.tsx
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── Spinner.tsx
│   │   ├── HammerIcon.tsx
│   │   ├── Dropdown.tsx
│   │   ├── UserDropdown.tsx
│   │   ├── UserDisplayName.tsx
│   │   ├── ProjectInfoCard.tsx
│   │   └── ServiceHoverImage.tsx
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── ContentWrapper.tsx
│   │   └── ProgressLine.tsx
│   ├── modals/                   # Modal components
│   │   ├── ServiceModal.tsx
│   │   ├── ServiceModalWrapper.tsx
│   │   ├── TransactionModal.tsx
│   │   └── NameModal.tsx
│   ├── scenes/                   # Three.js scenes
│   │   ├── CardsScene.tsx
│   │   ├── LaunchpadCardsScene.tsx
│   │   ├── CardsSceneContainer.tsx
│   │   └── LaunchpadCardsSceneContainer.tsx
│   └── roles/                    # Role-specific components (future)
│       ├── founder/
│       ├── investor/
│       └── advisor/
├── contexts/                     # React contexts
│   ├── AuthContext.tsx          # Authentication & user state
│   ├── MarketplaceContext.tsx   # Marketplace category selection
│   ├── DropdownContext.tsx      # Global dropdown state
│   ├── ServiceModalContext.tsx  # Service modal state
│   └── TransactionModalContext.tsx # Transaction modal state
├── styles/                       # Style definitions
│   ├── transactionItem.ts       # Transaction list styles
│   └── userDisplayName.ts       # User display name styles
└── public/                       # Static assets
    ├── img/
    ├── fonts/
    └── ...
```

## 🎯 Role-Based Architecture

### Founder Role (`/founder/*`)
- **Main Page**: `/founder` - Launchpad with 3D scene
- **Wallet**: `/founder/wallet` - Financial management
- **Referral**: `/founder/referral` - Referral program
- **Profile**: `/founder/profile` - User settings

### Investor Role (`/investor/*`)
- **Main Page**: `/investor/dashboard` - Vault with transactions
- **Profile**: `/investor/profile` - User settings

### Advisor Role (`/advisor/*`)
- **Main Page**: `/advisor/services` - Service management
- **Profile**: `/advisor/profile` - User settings

## 🔧 Component Organization

### UI Components (`/components/ui/`)
Reusable UI elements used across the application:
- Buttons, dropdowns, spinners, icons
- Form elements, cards, hover effects

### Layout Components (`/components/layout/`)
Application structure components:
- Header with navigation and user menu
- Content wrapper with scaling effects
- Progress line for page transitions

### Modal Components (`/components/modals/`)
Overlay components for detailed views:
- Service details modal
- Transaction details modal
- User name input modal

### Scene Components (`/components/scenes/`)
Three.js 3D scene components:
- Main cards scene for marketplace
- Launchpad cards scene for founder dashboard
- Container components for scene management

## 🎨 Styling Architecture

### Centralized Styles (`/styles/`)
- `transactionItem.ts` - Transaction list styling
- `userDisplayName.ts` - User name display styling
- Future: Role-specific style modules

### Tailwind CSS
- Custom color tokens (white-900, onsurface-900, etc.)
- Custom font sizes (display, heading, subheading, etc.)
- Responsive design patterns

## 🔄 State Management

### Context Providers
1. **AuthContext** - User authentication, role, display name
2. **MarketplaceContext** - Category selection and filtering
3. **DropdownContext** - Global dropdown open/close state
4. **ServiceModalContext** - Service modal state management
5. **TransactionModalContext** - Transaction modal state management

### Local State
- Component-specific state using React hooks
- Form state management
- UI interaction state

## 🚀 Benefits of New Architecture

### ✅ **Modularity**
- Clear separation of concerns
- Role-specific pages and components
- Reusable UI components

### ✅ **Scalability**
- Easy to add new roles
- Simple to extend functionality
- Clear component hierarchy

### ✅ **Maintainability**
- Centralized styling
- Consistent naming conventions
- Logical file organization

### ✅ **Developer Experience**
- Clear import paths
- Intuitive component structure
- Easy to find and modify code

## 🔄 Migration Notes

### Legacy Routes
- `/launchpad` → `/founder`
- `/wallet` → `/founder/wallet`
- `/referral` → `/founder/referral`
- `/profile` → Role-specific profiles

### Import Updates
All component imports have been updated to use the new structure:
- `@/components/ui/` for UI components
- `@/components/layout/` for layout components
- `@/components/modals/` for modal components
- `@/components/scenes/` for 3D scene components
