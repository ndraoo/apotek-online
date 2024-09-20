import React from "react";

const Banner = () => {
    return (
    <>
    <div className="bg-cover bg-no-repeat bg-center py-36" style={{ backgroundImage: `url('public/buyer/images/banner.jpeg')` }}>
        <div class="container">
          
            <div class="mt-12">
                
            </div>
        </div>
    </div>

    <div class="container py-16">
        <div class="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
            <div class="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                <img src="public/buyer/images/icons/delivery-van.svg" alt="Delivery" class="w-12 h-12 object-contain" />
                <div>
                    <h4 class="font-medium capitalize text-lg">Free Shipping</h4>
                    <p class="text-gray-500 text-sm">Order over Rp. 200.000</p>
                </div>
            </div>
            <div class="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                <img src="public/buyer/images/icons/money-back.svg" alt="Delivery" class="w-12 h-12 object-contain" />
                <div>
                    <h4 class="font-medium capitalize text-lg">Money Rturns</h4>
                    <p class="text-gray-500 text-sm">30 days money returs</p>
                </div>
            </div>
            <div class="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                <img src="public/buyer/images/icons/service-hours.svg" alt="Delivery" class="w-12 h-12 object-contain" />
                <div>
                    <h4 class="font-medium capitalize text-lg">24/7 Support</h4>
                    <p class="text-gray-500 text-sm">Customer support</p>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}
export default Banner