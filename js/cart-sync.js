// ===================================
// Cart Synchronization Utilities
// Syncs cart between localStorage and server
// ===================================

const CartSync = {
    // Sync local cart to server after login
    async syncLocalToServer() {
        console.log('🔄 Starting cart sync: localStorage → Server');
        
        try {
            // Get local cart
            const localCart = Cart.getLocalCart();
            
            if (!localCart || localCart.length === 0) {
                console.log('✅ No local cart items to sync');
                return { success: true, merged: 0 };
            }

            console.log(`📦 Found ${localCart.items.length} items in local cart`);

            // Get server cart
            const serverCartResponse = await CartAPI.getCart();
            
            if (!serverCartResponse.success) {
                console.error('❌ Failed to get server cart:', serverCartResponse.message);
                return { success: false, message: serverCartResponse.message };
            }

            const serverItems = serverCartResponse.data.items || [];
            console.log(`🗄️ Server has ${serverItems.length} items`);

            // Merge strategy: Add quantities if item exists, otherwise add new item
            let mergedCount = 0;
            let addedCount = 0;
            let errorCount = 0;

            for (const localItem of localCart.items) {
                try {
                    // Check if item exists in server cart
                    const existingItem = serverItems.find(
                        item => item.productId === localItem.productId
                    );

                    if (existingItem) {
                        // Item exists - update quantity
                        const newQuantity = existingItem.quantity + localItem.quantity;
                        console.log(`🔄 Merging ${localItem.name}: ${existingItem.quantity} + ${localItem.quantity} = ${newQuantity}`);
                        
                        const updateResponse = await CartAPI.updateItem(
                            existingItem.cartItemId,
                            newQuantity
                        );

                        if (updateResponse.success) {
                            mergedCount++;
                        } else {
                            errorCount++;
                            console.error('❌ Failed to update item:', updateResponse.message);
                        }
                    } else {
                        // Item doesn't exist - add new
                        console.log(`➕ Adding new item: ${localItem.name} (qty: ${localItem.quantity})`);
                        
                        const addResponse = await CartAPI.addItem(
                            localItem.productId,
                            localItem.quantity
                        );

                        if (addResponse.success) {
                            addedCount++;
                        } else {
                            errorCount++;
                            console.error('❌ Failed to add item:', addResponse.message);
                        }
                    }
                } catch (error) {
                    errorCount++;
                    console.error('❌ Error processing item:', error);
                }
            }

            // Clear local cart after successful sync
            Cart.clearLocalCart();
            console.log('🗑️ Local cart cleared after sync');

            // Update cart badge
            await Cart.updateCartBadge();

            const message = `Synced cart: ${mergedCount} merged, ${addedCount} added`;
            console.log(`✅ ${message}`);

            // Show toast notification
            if (mergedCount + addedCount > 0) {
                Toast.success(`Cart synced! ${mergedCount + addedCount} items updated`);
            }

            return {
                success: true,
                merged: mergedCount,
                added: addedCount,
                errors: errorCount,
                message: message
            };

        } catch (error) {
            console.error('❌ Cart sync failed:', error);
            return {
                success: false,
                message: 'Failed to sync cart',
                error: error.message
            };
        }
    },

    // Sync server cart to local storage (when logging out)
    async syncServerToLocal() {
        console.log('🔄 Starting cart sync: Server → localStorage');
        
        try {
            if (!Auth.isLoggedIn()) {
                console.log('⚠️ User not logged in, skipping sync');
                return { success: false, message: 'Not logged in' };
            }

            // Get server cart
            const serverCartResponse = await CartAPI.getCart();
            
            if (!serverCartResponse.success) {
                console.error('❌ Failed to get server cart:', serverCartResponse.message);
                return { success: false, message: serverCartResponse.message };
            }

            const serverItems = serverCartResponse.data.items || [];
            console.log(`📦 Syncing ${serverItems.length} items to localStorage`);

            // Clear local cart first
            Cart.clearLocalCart();

            // Add each server item to local cart
            let syncedCount = 0;
            for (const item of serverItems) {
                Cart.addToLocalCart(
                    {
                        id: item.productId,
                        name: item.name,
                        price: item.price,
                        image: item.image
                    },
                    item.quantity
                );
                syncedCount++;
            }

            console.log(`✅ Synced ${syncedCount} items to localStorage`);

            return {
                success: true,
                synced: syncedCount,
                message: `${syncedCount} items synced to local storage`
            };

        } catch (error) {
            console.error('❌ Server to local sync failed:', error);
            return {
                success: false,
                message: 'Failed to sync cart',
                error: error.message
            };
        }
    },

    // Auto-sync: Call this after login
    async autoSyncAfterLogin() {
        console.log('🔄 Auto-sync triggered after login');
        
        // Small delay to ensure auth is fully set up
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return await this.syncLocalToServer();
    },

    // Auto-sync: Call this before logout
    async autoSyncBeforeLogout() {
        console.log('🔄 Auto-sync triggered before logout');
        
        return await this.syncServerToLocal();
    }
};

// Make CartSync available globally
window.CartSync = CartSync;

console.log('✅ Cart Sync utilities loaded');