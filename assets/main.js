const PUBLISHABLE_KEY = 'pk_test_jQS3QjS9bAqR3TgTViQFS51300gC13U0tV'
const DOMAIN = location.href.replace(/[^/]*$/, '')
const stripe = Stripe(PUBLISHABLE_KEY)

function hideAllPricingTables() {
  const pricingTables = document.getElementsByClassName(`pricing-table`)
  for (let index = 0; index < pricingTables.length; index++) {
    const pricingTable = pricingTables[index]
    pricingTable.style.visibility = `hidden`
  }
}

const productMap = {
  golinks: {
    title: `go/links`,
    subtitle: `Easy to remember short links, shared within your group.`,
  },
}

function showPricingTable() {
  hideAllPricingTables()
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get('productId') || `golinks`
  const product = productMap[productId]
  const productTitle = document.getElementById(`product-title`)
  productTitle.textContent = product.title
  const productSubtitle = document.getElementById(`product-subtitle`)
  productSubtitle.textContent = product.subtitle
  const productDescription = document.getElementById(`product-description`)
  productDescription.classList.add(`is-dark`)
  const productTable = document.getElementById(`pricing-table-${productId}`)
  if (productTable) {
    productTable.style.visibility = `visible`
  }
}

function saveCustomerEmail(params) {
  const urlParams = new URLSearchParams(window.location.search)
  const customerEmail = urlParams.get(`customerEmail`)
  if (customerEmail) {
    localStorage.setItem(`customerEmail`, customerEmail)
  }
}

function handleResult(result) {
  if (result.error) {
    var displayError = document.getElementById('error-message')
    displayError.textContent = result.error.message
  }
}

function handleSuccessOrCancel() {
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatus = urlParams.get(`paymentStatus`)
  const productDescription = document.getElementById(`product-description`)

  if (paymentStatus === `success`) {
    productDescription.classList.add(`is-success`)
  }
  if (paymentStatus === `failure`) {
    productDescription.classList.add(`is-warning`)
  }
}

function enablePlanButtons() {
  const DOMAIN = location.href.replace(/[^/]*$/, '')
  const planButtons = document.querySelectorAll(`button.plan-button`)
  console.log(`planButtons`, planButtons)
  planButtons.forEach((button) => {
    button.addEventListener(`click`, (e) => {
      const mode = e.target.dataset.checkoutMode
      const priceId = e.target.dataset.priceId
      const lineItems = [{ price: priceId, quantity: 1 }]
      const customerEmail = localStorage.getItem(`customerEmail`)

      stripe.redirectToCheckout({
        customerEmail,
        mode,
        lineItems,
        successUrl: `${DOMAIN}?paymentStatus=success&sessionId={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${DOMAIN}?paymentStatus=failure&sessionId={CHECKOUT_SESSION_ID}`,
      })
    })
  })
}

saveCustomerEmail()
showPricingTable()
enablePlanButtons()
handleSuccessOrCancel()
