async function onClickdeleteConfirmation() {
    try {
        const deleteButton = document.getElementById('confirmDeleteButton');
        deleteButton.disabled = true;
        deleteButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Deleting...';

        const itemType = document.getElementById('deleteItemType').textContent.toLowerCase();
        const itemName = document.getElementById('deleteItemName').textContent;
        const contentId = `${itemType}sContent`;
        
        // Find the table row and ID
        const table = document.querySelector(`#${contentId} tbody`);
        if (!table) throw new Error(`Table for ${itemType} not found`);
        
        const rows = Array.from(table.getElementsByTagName('tr'));
        const targetRow = rows.find(row => row.cells[1].textContent === itemName);
        if (!targetRow) throw new Error('Item not found');
        
        const itemId = targetRow.cells[0].textContent;

        const response = await fetch(`/delete?${itemType}&id=${itemId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (!result.successful) throw new Error(result.message || 'Delete failed');

        // Clear cache if needed
        if (itemType === 'operator') operatorsCache = null;

        // Hide modal and refresh table
        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal')).hide();
        if (document.getElementById(contentId)) {
            await renderData(contentId);
        }
        
        createFlashMessage(`${itemType} "${itemName}" deleted successfully`, 'success');
    } catch (error) {
        console.error('Delete error:', error);
        createFlashMessage(error.message || 'Delete operation failed', 'danger');
    } finally {
        const deleteButton = document.getElementById('confirmDeleteButton');
        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete';
    }
}