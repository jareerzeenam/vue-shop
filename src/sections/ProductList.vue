<template>
  <div class="products" id="products">
    <div class="container">
      <h1 class="text-center p-5">Our Products List</h1>
      <div class="row">
        <div class="col-md-4" v-for="product in products" :key="product.id">
          <div class="card product-item">
            <carousel :perPage="1" :autoplay="1">
              <slide v-for="image in product.images" :key="image.id">
                <img
                  :src="image"
                  alt="..."
                  class="card-img-top"
                  width="250px"
                />
              </slide>
            </carousel>

            <div class="card-body">
              <div class="d-flex justify-content-between">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-price">{{ product.price | currency('Rs.') }}</p>
              </div>
              <!-- <p class=" card-text" v-html="product.description"></p> -->
              <a href="#" class="btn btn-primary">Add To Cart</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "product-list",
  props: {
    msg: String,
  },
  data() {
    return {
      products: [],
    };
  },
  methods: {
    // getImage(images) {
    //   return images[0];
    // },
  },
  firestore() {
    return {
      products: db.collection("products"),
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.products {
  margin-top: 7rem;
  background: #f2f2f2;
  padding-bottom: 3rem;
}
</style>
