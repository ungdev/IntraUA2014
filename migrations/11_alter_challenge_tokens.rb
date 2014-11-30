Sequel.migration do
    up do
        alter_table(:challenge_tokens) do
            add_column :name, String, :null=>false, :unique=>true
            drop_column :value
            add_column :value, Integer, :null=>false, :default=>10
            
        end
    end

    down do
        alter_table(:challenge_tokens) do
            drop_column :value
            drop_column :name
            add_column :value, String ,:null=>false, :unique=>true

        end
    end
end