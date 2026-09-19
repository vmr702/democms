(function ($) {
    'use strict';

    function refreshProperties() {
        var category = [];
        var $properties = $('.property_all');

        $('.category_checked').each(function () {
            category[category.length] = $(this).attr('data-category-id');
        });

        $properties.addClass('is-loading').attr('aria-busy', 'true');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { 
                category: category
            },
            success: function (data) {
                if (data != 'no') {
                    $properties.html(data);
                }
            },
            error: function () {
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
            }
        });
    }

    // Выбор категории в товаре и обновление блока характеристик.
    $('body').on('change', '.js-category', function () {
        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        refreshProperties();
    });

    // Обновление блока характеристик при загрузке страницы.
    $(refreshProperties);
}(jQuery));
