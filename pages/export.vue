<template>
    <div>
        <form action="/.netlify/functions/export">
            <input type="date" id="startdate" name="startdate">
            <input type="date" id="enddate" name="enddate">
            <input type="text" name="authkey" :value="this.$auth.$storage.getUniversal('_token.aad')" style="display:none"/>
            <button type="submit" value="Submit">Export</button>
        </form>
    </div>
</template>

<script>
export default { 
middleware: 'auth'
}
</script>
