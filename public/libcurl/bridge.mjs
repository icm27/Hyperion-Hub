// 1. Execute your existing local index.js file
import "./index.js";

// 2. Extract the class from the global UMD wrapper
const Transport = self.LibcurlTransport?.LibcurlClient || self.LibcurlTransport?.default || self.LibcurlTransport;

// 3. Export it properly for BareMux v2
export default Transport;
