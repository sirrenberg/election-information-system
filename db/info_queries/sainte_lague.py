def sainte_lague(votes, seats):
    """
    Calculates Parliamentary Seat Allocation using the Sainte-Laguë Method.

    Args:
    - votes (list): List of votes for each party.
    - seats (int): Total number of seats to be allocated.

    Returns:
    - seat_allocation (list): List of seats allocated to each party.
    """

    num_parties = len(votes)
    seat_allocation = [0] * num_parties

    # Create a list of tuples containing the quotient and party index
    quotient_list = [(votes[i] / (2 * seat_allocation[i] + 1), i) for i in range(num_parties)]

    # Allocate seats
    for _ in range(seats):
        # Find the party with the highest quotient
        max_quotient, max_index = max(quotient_list, key=lambda x: x[0])

        # Allocate a seat to the party with the highest quotient
        seat_allocation[max_index] += 1

        # Update the quotient for the party
        quotient_list[max_index] = (votes[max_index] / (2 * seat_allocation[max_index] + 1), max_index)

    return seat_allocation

# Example usage:
party_votes = [50000, 30000, 20000, 10000]
total_seats = 10

result = sainte_lague(party_votes, total_seats)
print("Seat Allocation:", result)
