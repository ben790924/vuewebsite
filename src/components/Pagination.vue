<template>
    <div>
    <nav>
        <ul class="pagination">
            <li class="page-item" :class='{"disable":!childpagination.has_pre}'>
            <a class="page-link" href="#" aria-label="Previous" @click.prevent='childPaginationGetProduct(childpagination.current_page - 1)'>
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
            </li>
            <li v-for='(page,key) in childpagination.total_pages' class="page-item" :key='key' :class='{"active":childpagination.current_page===page}' @click.prevent='childPaginationGetProduct(page)'><a class="page-link" href="#">{{page}}</a></li>
            <li class="page-item" :class='{"disable":!childpagination.has_next}'>
            <a class="page-link" href="#" aria-label="Next" @click.prevent='childPaginationGetProduct(childpagination.current_page + 1)'>
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
            </li>
        </ul>
    </nav>
    </div>
</template>
<script>

export default {
    // name:'paginations',
    props:{
            childpagination:{
                type:Object,
                default:{}
            }
    },
    methods:{
        childPaginationGetProduct(page){
            this.$emit('bridgepagination',page)
        }
    }
}
</script>
