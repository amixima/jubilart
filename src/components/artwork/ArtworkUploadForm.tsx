'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Check } from 'lucide-react';

interface ArtworkUploadFormProps {
  onSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ArtworkUploadForm({ onSubmit, isLoading = false }: ArtworkUploadFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    medium: '',
    style: '',
    subject: '',
    dimensions: {
      height: '',
      width: '',
      depth: '',
      unit: 'cm'
    },
    dominantColor: '',
    price: '',
    currency: 'USD',
    isForSale: false,
    externalSaleLink: '',
    location: '',
    material: '',
    tags: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      // Handle nested properties like dimensions.height
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please upload at least one image of your artwork');
      return;
    }
    
    if (!formData.title) {
      alert('Please provide a title for your artwork');
      return;
    }
    
    // Create FormData object to send to server
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('year', formData.year.toString());
    submitData.append('medium', formData.medium);
    submitData.append('style', formData.style);
    submitData.append('subject', formData.subject);
    submitData.append('dimensions', JSON.stringify(formData.dimensions));
    submitData.append('dominantColor', formData.dominantColor);
    submitData.append('price', formData.price);
    submitData.append('currency', formData.currency);
    submitData.append('isForSale', formData.isForSale.toString());
    submitData.append('externalSaleLink', formData.externalSaleLink);
    submitData.append('location', formData.location);
    submitData.append('material', formData.material);
    submitData.append('tags', formData.tags);
    
    // Append all images
    images.forEach((image, index) => {
      submitData.append(`image_${index}`, image);
    });
    
    if (onSubmit) {
      try {
        await onSubmit(submitData);
      } catch (error) {
        console.error('Error submitting artwork:', error);
        alert('An error occurred while uploading your artwork. Please try again.');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Artwork Images</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Existing images */}
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
              <img 
                src={url} 
                alt={`Artwork preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 hover:text-red-700 shadow-sm"
              >
                <X size={16} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-xs py-1 px-2">
                  Cover Image
                </div>
              )}
            </div>
          ))}
          
          {/* Add image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
          >
            <Plus size={24} className="mb-2" />
            <span className="text-sm">Add Image</span>
          </button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          multiple
        />
        
        <p className="text-sm text-gray-500">
          Upload high-quality images of your artwork. The first image will be used as the cover image.
        </p>
      </div>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your artwork, its inspiration, techniques used, etc."
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year Created
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
              Medium
            </label>
            <input
              type="text"
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Oil on Canvas, Digital, Photography"
            />
          </div>
          
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700">
              Style
            </label>
            <input
              type="text"
              id="style"
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Abstract, Realism, Impressionism"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Landscape, Portrait, Still Life"
            />
          </div>
        </div>
      </div>
      
      {/* Dimensions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dimensions</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="dimensions.height" className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="text"
              id="dimensions.height"
              name="dimensions.height"
              value={formData.dimensions.height}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dimensions.width" className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              type="text"
              id="dimensions.width"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dimensions.depth" className="block text-sm font-medium text-gray-700">
              Depth
            </label>
            <input
              type="text"
              id="dimensions.depth"
              name="dimensions.depth"
              value={formData.dimensions.depth}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dimensions.unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="dimensions.unit"
              name="dimensions.unit"
              value={formData.dimensions.unit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
              <option value="mm">Millimeters (mm)</option>
              <option value="ft">Feet (ft)</option>
              <option value="m">Meters (m)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dominantColor" className="block text-sm font-medium text-gray-700">
              Dominant Color
            </label>
            <input
              type="text"
              id="dominantColor"
              name="dominantColor"
              value={formData.dominantColor}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Blue, Red, Multicolor"
            />
          </div>
          
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700">
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Canvas, Paper, Wood, Metal"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Where is the artwork currently located?"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Separate tags with commas"
            />
          </div>
        </div>
      </div>
      
      {/* Sale Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Sale Information</h3>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="isForSale"
              name="isForSale"
              type="checkbox"
              checked={formData.isForSale}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="isForSale" className="font-medium text-gray-700">
              This artwork is for sale
            </label>
          </div>
        </div>
        
        {formData.isForSale && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {formData.currency === 'USD' ? '$' : 
                     formData.currency === 'EUR' ? '€' : 
                     formData.currency === 'GBP' ? '£' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="externalSaleLink" className="block text-sm font-medium text-gray-700">
                External Sale Link (Optional)
              </label>
              <input
                type="url"
                id="externalSaleLink"
                name="externalSaleLink"
                value={formData.externalSaleLink}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com/your-artwork-for-sale"
              />
              <p className="mt-1 text-sm text-gray-500">
                If you're selling this artwork on another platform, you can provide a link here.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Artwork'
          )}
        </button>
      </div>
    </form>
  );
}
