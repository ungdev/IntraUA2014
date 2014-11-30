Sequel.migration do
    up do
        alter_table(:challenges) do
            drop_column :date
            
        end
    end

    down do
        alter_table(:challenges) do
            add_column  :date, DateTime,:null=> false
        end
    end
end