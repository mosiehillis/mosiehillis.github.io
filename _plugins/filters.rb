module Jekyll
  module CustomFilters
    def starts_with(array, prefix)
      array.select { |image| image.name.start_with?(prefix) }
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomFilters)
