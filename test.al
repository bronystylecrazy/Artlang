count = 10;
message = "Sirawit Pratoomsuwan" + count + "sirawit";
message := 5;
{ hello: 'world'};

(div
    (h1
        "message {count} hello",
        input: 'sirawit',
        type: 'text',
        ...rest
    )
    (if x > 2
        ((h1 "message"),(h1 "message"))
        (h1 "this is else")
    )
    count 1 + 2 "Sirawit Pratoomsuwan"
    (br)
)